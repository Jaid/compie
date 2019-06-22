import path from "path"

import yargs from "yargs"
import pascalCase from "pascal-case"
import fsp from "@absolunet/fsp"
import indexTemplate from "src/templates/index.hbs"
import styleTemplate from "src/templates/style.hbs"
import jaidLogger from "jaid-logger"

const logger = jaidLogger(["Jaid", _PKG_TITLE])

const job = async ({srcFolder, name, page}) => {
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
        import: "classnames",
        from: "classnames",
      },
      {
        import: "css",
        from: "./style.scss",
      },
    ],
    props: [
      {
        propName: "className",
        propType: "PropTypes.oneOfType([\n      PropTypes.string,\n      PropTypes.object,\n      PropTypes.arrayOf(PropTypes.string),\n      PropTypes.arrayOf(PropTypes.object),\n    ])",
      },
    ],
  }
  if (page) {
    context.className = pascalCase(`${name} page`)
    context.props.push({
      propName: "match",
      propType: "PropTypes.exact({\n      isExact: PropTypes.bool.isRequired,\n      path: PropTypes.string.isRequired,\n      url: PropTypes.string.isRequired,\n      params: PropTypes.object,\n    }).isRequired",
    })
    context.wrapperTag = "main"
    context.folder = path.join(srcFolder, "pages", name)
    context.content = `Page ${name}`
  } else {
    context.className = name |> pascalCase
    context.wrapperTag = "div"
    context.folder = path.join(srcFolder, "components", context.className)
    context.content = `Component ${name}`
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
}
yargs.command("$0 <name>", "Creates a React component directory", builder, job).argv