const randomNumber = Math.ceil(Math.random() * 10)

export const state = () => ({
  user: {
    id: randomNumber,
    name: `test-user-${randomNumber}`,
  }
})

export const getters = {
  userGetter: state => state.user,
}
