import { Amplify } from 'aws-amplify'
import {
  signIn as amplifySignIn,
  signUp as amplifySignUp,
  confirmSignUp as amplifyConfirmSignUp,
  signOut as amplifySignOut,
  resetPassword as amplifyResetPassword,
  confirmResetPassword as amplifyConfirmResetPassword,
  updatePassword as amplifyUpdatePassword,
  updateUserAttribute as amplifyUpdateUserAttribute,
  getCurrentUser as amplifyGetCurrentUser,
  fetchAuthSession,
} from 'aws-amplify/auth'

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
      userPoolClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
    },
  },
})

export async function signIn(email: string, password: string) {
  return amplifySignIn({ username: email, password })
}

export async function signUp(email: string, password: string) {
  return amplifySignUp({
    username: email,
    password,
    options: { userAttributes: { email } },
  })
}

export async function confirmSignUp(email: string, code: string) {
  return amplifyConfirmSignUp({ username: email, confirmationCode: code })
}

export async function signOut() {
  return amplifySignOut()
}

export async function forgotPassword(email: string) {
  return amplifyResetPassword({ username: email })
}

export async function confirmForgotPassword(
  email: string,
  code: string,
  newPassword: string,
) {
  return amplifyConfirmResetPassword({
    username: email,
    confirmationCode: code,
    newPassword,
  })
}

export async function changePassword(
  oldPassword: string,
  newPassword: string,
) {
  return amplifyUpdatePassword({ oldPassword, newPassword })
}

export async function changeEmail(newEmail: string) {
  return amplifyUpdateUserAttribute({
    userAttribute: { attributeKey: 'email', value: newEmail },
  })
}

export async function getCurrentUser() {
  try {
    return await amplifyGetCurrentUser()
  } catch {
    return null
  }
}

export async function getIdToken(): Promise<string | null> {
  try {
    const session = await fetchAuthSession()
    return session.tokens?.idToken?.toString() ?? null
  } catch {
    return null
  }
}
