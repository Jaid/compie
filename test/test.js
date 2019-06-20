import path from "path"

import coffee from "coffee"

const main = path.resolve(process.env.MAIN)

it("should run internal command", () => coffee.fork(main, ["test-component", "--components-folder", "dist/test/components", "--force-pascal"])
  .expect("code", 0)
  .expect("stdout", /created file/i)
  .expect("stdout", /TestComponent[/\\]index\.js/)
  .debug(true)
  .end())