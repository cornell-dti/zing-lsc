export interface Admin {
  name: string
  email: string
}
export interface AllowedUsers {
  data: Admin[]
  removeAdmin: (admin: Admin) => void
  editAdmin: () => void
}
