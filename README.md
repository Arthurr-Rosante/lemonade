## Lemonade - cli

### Commands/Features

1. **clean**: empties the folder by excluding all existing files. If no folder
   is specified, cleans the `%temp%` folder by default.

- **--path, -p [folder_path]**: executes the `clean` command in the specified folder.
- **--name, -n [name]**: executes the `clean` command in the matching folder set by the `set` command.
- **--log, -l**: logs the results of the cleaning operation.

---

2. **add**: adds a configuration that receives a name and can be called by the `clean` command through `lemonade clean -n <name>`

- **--name, -n <name> (required!)**: saves the configuration with the specified name.
- **--path, -p <path> (required!)**: saves the configuration with the specified path.
- **--default, -D**: saves the configuration as the new default folder called by `lemonade clean`.

---

3. **remove | rm**: removes a configuration setted by the `set` command.

- **--name, -n <name> (required!)**: removes the configuration with the specified name.

---

4. **set**: sets the default configuration to be called by the `lemonade clean` command

- **--name, -n <name> (required!)**: sets the configuration with the specified name.

---

5. **list**: lists saved configurations and shows which one is active.

- **--root, -r**: logs the path to the folder containing the configurations.

---
