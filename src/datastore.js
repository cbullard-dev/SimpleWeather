const user_settings = [{ team_id: 'abcd', users: [] }]

exports.add_user = (options) => {
  // If there are no options, or you are mission the user_id or team_id return
  if (!options && !options.user_id && !options.team_id) return

  // If the team does not exist, push new team to array
  if (!user_settings.some((u) => u.team_id === options.team_id)) {
    user_settings.push({
      team_id: options.team_id,
      users: [{ user_id: options.user_id }],
    })
    return 'Team and user added to data store'
  }

  const searchIndex = user_settings.findIndex(
    (team) => team.team_id === options.team_id
  )

  // If the user does not exist, push new user to the array
  if (
    !user_settings[searchIndex].users.some((u) => u.user_id === options.user_id)
  ) {
    user_settings[searchIndex].users.push({ user_id: options.user_id })
    return 'Team already exists, Added user to datastore'
  }

  return 'Team and user already exist, nothing to add to datastore'
}
