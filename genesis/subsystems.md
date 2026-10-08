# Subsystems

## `application` Public application

Owns the public adaptive shell, home, settings navigation, service health,
application migrations and isolated database test launchers.

### Program

- `genesis/program/application/home.md`
- `genesis/program/application/health.md`
- `genesis/program/application/testing.md`

### Data owned

- Application-owned schema migrations; initially no business tables.

### Data used

- Managed MySQL database, separate integration and browser test databases.
