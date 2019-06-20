import path from "path"

import yargs from "yargs"
import pascalCase from "pascal-case"
import fsp from "@absolunet/fsp"
import indexTemplate from "src/templates/index.hbs"
import styleTemplate from "src/templates/style.hbs"
import jaidLogger from "jaid-logger"

const logger = jaidLogger(["Jaid", _PKG_TITLE])

const job = async ({componentsFolder, name, forcePascal}) => {
  if (forcePascal) {
    name = name |> pascalCase
  }
  const componentFolder = path.join(componentsFolder, name)
  await fsp.ensureDir(componentsFolder)
  const fileDescriptions = [
    {
      name: "index.js",
      template: indexTemplate,
    },
    {
      name: "style.scss",
      template: styleTemplate,
    },
  ]
  const writeFileJobs = fileDescriptions.map(async fileDescription => {
    const content = fileDescription.template({
      name,
    })
    const file = path.join(componentFolder, fileDescription.name)
    await fsp.outputFile(file, content, "utf8")
    logger.info("Created file %s", file)
  })
  await Promise.all(writeFileJobs)
  process.exit(0)
}

const builder = {
  "components-folder": {
    default: path.join(process.cwd(), "src", "components"),
    type: "string",
  },
  "force-pascal": {
    default: false,
    type: "boolean",
  },
}
yargs.command("$0 <name>", "Creates a React component directory", builder, job).argv