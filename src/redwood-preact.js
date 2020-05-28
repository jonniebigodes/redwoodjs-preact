#!/usr/bin/env node
import Listr from "listr";
import execa from "execa";
import fs from "fs";
import path from "path";

const destinationFolder= process.cwd()
const updateConfigurationFiles = () => {
  return [
    {
      title:'Checking project type',
      task:()=>{
        // this could probably use the internal/core redwoodJS package. For now it will sufice
        const tomlFilePath= path.join(destinationFolder,'redwood.toml')
        if (!fs.existsSync(tomlFilePath)){
          console.log(`The project located at ${destinationFolder} is not a RedwoodJS project. The setup will be aborted`)
          process.exit(1)
        }
      }
    },
    {
      title: "Configuring web/src/index.js for Preact",
      task: () => {
        fs.copyFile(
          path.join(__dirname,"../preact-files/","root-index.js"),
          path.join(destinationFolder,'/web/src/','index.js'),(error)=>{
            if (error){
              throw new Error("Something went wrong updating web/src/index.js file")
            }
            console.info('web/src/index.js was updated')
          }
        )
      },
    },
    {
      title: "Updating web babel.config.js for Preact",
      task: () => {
        fs.copyFile(
          path.join(__dirname, "../preact-files/", "preact-babel-config.js"),
          path.join(destinationFolder,"/web/",".babelrc.js"),
          (error) => {
            if (error) {
              throw new Error("Something went wrong updating babel.config.js");
            }
            console.info("babel.config was updated");
          }
        );
      },
    },
    {
      title:'Creating the necessary configuration folder',
      task:()=>{
        try {
          fs.mkdirSync(path.join(destinationFolder,'/web/config'))
        } catch (error) {
          console.log(`There was an error creating the necessary folder for the Preact configuration`)
        }
      }
    },
    {
      title:"Updating webpack for Preact",
      task:()=>{
        fs.copyFile(
          path.join(__dirname, "../preact-files/", "webpack-preact-config.js"),
          path.join(destinationFolder, "/web/config/","webpack.config.js"),
          (error) => {
            if (error) {
              throw new Error("Something went wrong updating /web/config/webpack.config.js");
            }
            console.info("The webpack configuration was updated");
          }
        );
      }
    },
  ];
};
const installPreactPackagesTasks = () => {
  return [
    {
      title:
        "Adding Preact to the application",
      task: () =>
        execa("yarn", ["workspace", "web", "add", "preact"])
          .then(() => {
            console.info(
              "Preact was added to the application. Going to move onto adding the necessary test packages"
            );
          })
          .catch((err) => {
            console.log(err);
            throw new Error(
              "Something went wrong adding preact. The setup will be aborted."
            );
          }),
    },
    {
      title: "Adding the necessary testing packages for Preact",
      task: () =>
        execa("yarn", [
          "workspace",
          "web",
          "add",
          "-D",
          "@babel/plugin-transform-react-jsx",
          "@testing-library/preact",
          "@emotion/babel-plugin-jsx-pragmatic"
        ])
          .then(() => {
            console.info(
              "The necessary test packages were added to your application."
            );
          })
          .catch((err) => {
            console.log(err);
            throw new Error(
              "Something went wrong adding preact testing packages. The setup will be aborted."
            );
          }),
    },
  ];
};

new Listr(
  [
    
    {
      title: "Making necessary configuration changes",
      task: () => new Listr(updateConfigurationFiles()),
    },
    {
      title: "Adding Preact packages to your project...This could take a little bit so sit back",
      task: () => new Listr(installPreactPackagesTasks()),
    },
  ],
  { collapse: false, exitOnError: true }
)
  .run()
  .then(() => {
    console.log();
    console.log(
      `Thanks for using this tool!`
    );
    console.log();
    console.log(
      "All necessary configurations are done, have fun with RedwoodJS!"
    );
  })
  .catch((e) => {
    console.log();
    console.log(e);
    process.exit(1);
  });
