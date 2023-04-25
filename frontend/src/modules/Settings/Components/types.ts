export interface Admin {
  name: string
  email: string
}
export interface AllowedUsers {
  data: Admin[]
  removeAdmin: (admin: Admin) => void
  editAdmin: () => void
}
export interface AddAdminProp {
  open: boolean
  handleClose: () => void
  addAdmin: (arg: Admin) => void
}
