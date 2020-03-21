import fsp from "@absolunet/fsp"
import jaidLogger from "jaid-logger"
import {sortBy} from "lodash"
import {pascalCase} from "pascal-case"
import path from "path"
import yargs from "yargs"

import getPropTypeFromJsdocType from "lib/getPropTypeFromJsdocType"

import indexTemplate from "src/templates/index.hbs"
import styleTemplate from "src/templates/style.hbs"

const logger = jaidLogger(["Jaid", _PKG_TITLE])

const job = async ({srcFolder, name, page, prop = []}) => {
  const context = {
    imports: [
      {
        import: "React",
        from: "react",
      },
      {
        import: "PropTypes",
        from: "prop-types",
      },
      {
        import: "css",
        from: "./style.scss",
      },
    ],
    props: [],
  }
  if (page) {
    context.isPage = true
    context.target = "page"
    context.className = pascalCase(`${name} page`)
    context.props.push({
      propName: "match",
      propType: "PropTypes.object.isRequired",
      jsdocType: "Object",
    })
    context.props.push({
      propName: "match.isExact",
      jsdocType: "boolean",
    })
    context.props.push({
      propName: "match.path",
      jsdocType: "string",
    })
    context.props.push({
      propName: "match.url",
      jsdocType: "string",
    })
    context.props.push({
      propName: "match.params",
      jsdocType: "Object",
    })
    context.wrapperTag = "main"
    context.folder = path.join(srcFolder, "pages", name)
    context.content = `Page ${name}`
  } else {
    context.target = "component"
    context.imports.push({
      import: "classnames",
      from: "classnames",
    })
    context.props.push({
      propName: "className",
      propType: "PropTypes.any",
      jsdocType: "*",
    })
    context.className = name |> pascalCase
    context.wrapperTag = "div"
    context.folder = path.join(srcFolder, "components", context.className)
    context.content = `Component ${name}`
  }
  for (const customProp of sortBy(prop)) {
    const [propName, jsdocType = "*"] = customProp.split(":")
    const propType = getPropTypeFromJsdocType(jsdocType)
    context.props.push({
      propName,
      jsdocType,
      propType,
    })
  }
  const fileDescriptions = [
    {
      context,
      name: "index.js",
      template: indexTemplate,
    },
    {
      context,
      name: "style.scss",
      template: styleTemplate,
    },
  ]
  const writeFileJobs = fileDescriptions.map(async fileDescription => {
    const content = fileDescription.template(fileDescription.context)
    const file = path.join(context.folder, fileDescription.name)
    await fsp.outputFile(file, content, "utf8")
    logger.info("Created file %s", file)
  })
  await Promise.all(writeFileJobs)
  process.exit(0)
}

const builder = {
  "src-folder": {
    default: path.join(process.cwd(), "src"),
    type: "string",
  },
  page: {
    default: false,
    type: "boolean",
  },
  prop: {
    type: "array",
  },
}
yargs.command("$0 <name>", "Creates a React component directory", builder, job).argv