#!/bin/bash
set -euo pipefail

PROFILE=""
REGION="ap-northeast-1"
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

while [[ $# -gt 0 ]]; do
  case $1 in
    --profile)
      PROFILE="$2"
      shift 2
      ;;
    --region)
      REGION="$2"
      shift 2
      ;;
    *)
      echo "Unknown option: $1"
      echo "Usage: $0 --profile <aws-profile> [--region <aws-region>]"
      exit 1
      ;;
  esac
done

if [[ -z "$PROFILE" ]]; then
  echo "Error: --profile is required"
  echo "Usage: $0 --profile <aws-profile> [--region <aws-region>]"
  exit 1
fi

AWS_OPTS="--profile $PROFILE --region $REGION --output json"

get_stack_output() {
  local stack_name="$1"
  local output_key="$2"
  aws cloudformation describe-stacks \
    $AWS_OPTS \
    --stack-name "$stack_name" \
    --query "Stacks[0].Outputs[?OutputKey=='${output_key}'].OutputValue | [0]" \
    --output text
}

json_to_env() {
  local json="$1"
  echo "$json" | python3 -c "
import sys, json
data = json.load(sys.stdin)
for key, value in data.items():
    print(f'{key}={value}')
"
}

LOCAL_API_PORT=3000
LOCAL_API_URL="http://localhost:${LOCAL_API_PORT}"
LOCAL_UI_PORT=4321
LOCAL_ADMIN_UI_PORT=5173

SSM_API_KEY_NAME="/headless-cms/api-key"

get_ssm_parameter() {
  local name="$1"
  aws ssm get-parameter \
    $AWS_OPTS \
    --name "$name" \
    --with-decryption \
    --query "Parameter.Value" \
    --output text
}

echo "Fetching stack outputs..."

# Fetch API_KEY from SSM
echo "  SSM ${SSM_API_KEY_NAME} -> API_KEY"
API_KEY=$(get_ssm_parameter "$SSM_API_KEY_NAME")

# API package
echo "  ApiStack -> packages/api/.env"
api_develop=$(get_stack_output "ApiStack" "ApiDevelopEnvironment")
json_to_env "$api_develop" > "$ROOT_DIR/packages/api/.env"
echo "AWS_REGION=${REGION}" >> "$ROOT_DIR/packages/api/.env"
echo "AWS_PROFILE=${PROFILE}" >> "$ROOT_DIR/packages/api/.env"
echo "PORT=${LOCAL_API_PORT}" >> "$ROOT_DIR/packages/api/.env"
echo "CORS_ORIGIN=http://localhost:${LOCAL_ADMIN_UI_PORT},http://localhost:${LOCAL_UI_PORT}" >> "$ROOT_DIR/packages/api/.env"
echo "API_KEY=${API_KEY}" >> "$ROOT_DIR/packages/api/.env"

# UI package (override API_BASE_URL with local URL)
echo "  UiStack -> packages/ui/.env"
ui_develop=$(get_stack_output "UiStack" "UiDevelopEnvironment")
json_to_env "$ui_develop" > "$ROOT_DIR/packages/ui/.env"
sed -i '' "s|^API_BASE_URL=.*|API_BASE_URL=${LOCAL_API_URL}|" "$ROOT_DIR/packages/ui/.env"
echo "API_KEY=${API_KEY}" >> "$ROOT_DIR/packages/ui/.env"
echo "PORT=${LOCAL_UI_PORT}" >> "$ROOT_DIR/packages/ui/.env"

# Admin UI package (override VITE_API_BASE_URL with local URL)
echo "  AdminUiStack -> packages/admin-ui/.env"
admin_ui_develop=$(get_stack_output "AdminUiStack" "AdminUiDevelopEnvironment")
json_to_env "$admin_ui_develop" > "$ROOT_DIR/packages/admin-ui/.env"
sed -i '' "s|^VITE_API_BASE_URL=.*|VITE_API_BASE_URL=${LOCAL_API_URL}|" "$ROOT_DIR/packages/admin-ui/.env"
echo "VITE_PORT=${LOCAL_ADMIN_UI_PORT}" >> "$ROOT_DIR/packages/admin-ui/.env"

# Tool package (merge AuthenticationStack + DataStack ToolEnvironment)
echo "  AuthenticationStack + DataStack -> packages/tool/.env"
auth_tool=$(get_stack_output "AuthenticationStack" "ToolEnvironment")
data_tool=$(get_stack_output "DataStack" "ToolEnvironment")
json_to_env "$auth_tool" > "$ROOT_DIR/packages/tool/.env"
json_to_env "$data_tool" >> "$ROOT_DIR/packages/tool/.env"
echo "AWS_REGION=${REGION}" >> "$ROOT_DIR/packages/tool/.env"
echo "AWS_PROFILE=${PROFILE}" >> "$ROOT_DIR/packages/tool/.env"

echo "Done!"
