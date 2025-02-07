## Lemonade - cli

### Commands/Features

1. **clean**: deletes all files in `%temp%` folder.

2. **schedule**: schedules an automatic cleanup function.

   - flags:
     - **--name (-n)**: name of the schedule
     - **--days (-d)**: list of days of the week [0-6]
     - **--hour (-h)**: in which hour to clean [0-23]
     - **--default**: sets a schedule to a default config

3. **activate**: activates the specified schedule.

   - flags:
     - **[required] --name (-n)**: name of the schedule to be activated

4. **deactivate**: deactivates the specified schedule.

- flags:
  - **[required] --name (-n)**: name of the schedule to be deactivated

5. **remove (rm)**:

   - **[required] --name (-n)**: name of the schedule to be removed

6. **list**: lists all the saved schedule configurations.

7. **--help**: lists all the commands available for the cli
