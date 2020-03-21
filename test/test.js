import coffee from "coffee"
import path from "path"

const main = path.resolve(process.env.MAIN)

it("should create component", () => coffee.fork(main, ["test-component", "--src-folder", "dist/test"])
  .expect("code", 0)
  .expect("stdout", /created file/i)
  .expect("stdout", /components[/\\]TestComponent[/\\]index\.js/)
  .debug(true)
  .end())

it("should create page", () => coffee.fork(main, ["user-profile", "--src-folder", "dist/test", "--page"])
  .expect("code", 0)
  .expect("stdout", /created file/i)
  .expect("stdout", /pages[/\\]user-profile[/\\]index\.js/)
  .debug(true)
  .end())