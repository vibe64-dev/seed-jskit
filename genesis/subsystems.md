# Subsystems

## `application` Application shell

Owns the private home and adaptive navigation around authenticated features.

### Source

- Directory `src/components`

### Program

- `genesis/program/application/home.md`
- `genesis/program/application/shell-navigation.md`

### Data owned

- Nothing.

### Data used

- Table `database` `default` `users`

## `accounts` Accounts and authentication

Owns local authentication and self-service profiles through installed JSKIT packages.

### Source

- Directory `src/pages`

### Program

- `genesis/program/authentication/accounts.md`
- `genesis/program/accounts/settings.md`

### Data owned

- Table `database` `default` `auth_local_users`
- Table `database` `default` `auth_local_sessions`
- Table `database` `default` `auth_local_recovery`
- Table `database` `default` `users`
- Table `database` `default` `user_settings`

### Data used

- Nothing.

## `operations` Runtime operations

Owns startup, health checks, and preparation of the application's database.

### Source

- Directory `.`

### Program

- `genesis/program/operations/runtime.md`

### Data owned

- Nothing.

### Data used

- Table `database` `default` `auth_local_users`
- Table `database` `default` `auth_local_sessions`
- Table `database` `default` `auth_local_recovery`
- Table `database` `default` `users`
- Table `database` `default` `user_settings`
