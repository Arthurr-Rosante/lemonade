# Lemonade CLI

Lemonade é uma ferramenta de linha de comando (CLI) para gerenciar e limpar pastas temporárias de forma eficiente. Com ela, você pode limpar diretórios específicos, salvar configurações personalizadas e automatizar tarefas de limpeza.

## Instalação

Se o Lemonade CLI estiver publicado como um pacote npm, você pode instalá-lo globalmente com o seguinte comando:

```bash
npm install -g lemonade-cli
```

Se estiver usando yarn ou pnpm, utilize:

```bash
yarn global add lemonade-cli

pnpm add -g lemonade-cli
```

Após a instalação, você pode rodar `lemonade --help` para verificar os comandos disponíveis.

## Comandos e Funcionalidades

### 1. clean

Esvazia a pasta especificada, removendo todos os arquivos existentes. Caso nenhuma pasta seja informada, a limpeza ocorrerá na pasta `%temp%` por padrão.

Opções:

`--path, -p <folder_path>`: Define a pasta a ser limpa.

`--name, -n <name>`: Usa uma configuração salva para determinar a pasta a ser limpa.

`--log, -l`: Registra o resultado da operação de limpeza.

### 2. add

Adiciona uma configuração nomeada, permitindo chamar a limpeza posteriormente pelo nome.

Opções:

`--name, -n <name>`: Nome da configuração.

`--path, -p <path>`: Caminho da pasta correspondente.

`--default, -D`: Define a configuração como padrão para o comando lemonade clean.

### 3. remove | rm

Remove uma configuração previamente salva.

Opções:

`--name, -n <name`>: Nome da configuração a ser removida.

### 4. set

Define uma configuração salva como a configuração padrão para o comando lemonade clean.

Opções:

`--name, -n <name>`: Nome da configuração a ser definida como padrão.

### 5. list

Lista todas as configurações salvas e exibe a configuração atualmente definida como padrão.

Opções:

`--root, -r`: Exibe o caminho da pasta onde as configurações estão armazenadas.

### Ajuda

Para mais informações sobre os comandos, utilize:

```bash
lemonade --help
lemonade <command> --help
```

Isso exibirá descrições detalhadas sobre o uso de cada comando e suas opções disponíveis.
