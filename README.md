# IU Plugin

First install the fast cli tool:

```bash
dart pub global activate -sgit https://github.com/dev-ideausher/iu.cli-master.git
```

Then you need to setup the envionment variables:

 - for macOS
    ```bash
   export PATH="$PATH:/Users/"yourpcname"/.pub-cache/bin"
    ```
 - for linux
    ```bash
   export PATH="export PATH="$PATH":"$HOME/.pub-cache/bin"
    ```

## Installation

installing the plugin right away :

``` bash
fast plugin add git https://github.com/dev-ideausher/iu_backend_plugin.git
```

After that, you need to set the Environmental path variable:

- for macOS 

    ``` bash
    export PATH="$PATH:/Users/"yourpcname"/.fastcli/bin"
    ```

- for linux

    ``` bash
    export PATH="export PATH="$PATH":"$HOME/.fastcli/bin"
    ```

To start a project, you need to run the following command:

``` bash
iu_backend run starter
```

To set up firebase auth functions, run :

``` bash
iu run auth
```

To refresh the plugin, run :

``` bash
iu_backend run refresh
```

To remove the plugin :

``` bash
fast plugin remove --name iu_backend
```

To list the plugins installed :

``` bash
fast plugin list
```

<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<sub><sub><sub>please don't ask me what is IU 🥹</sub></sub></sub>
