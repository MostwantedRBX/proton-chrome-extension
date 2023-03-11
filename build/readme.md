# How to generate extension zip files
Simply run the generate.py file. This will create a seperate folder for each implemented target in `output/<target>`. That's all!

# How to implement a new target
## Explanation
All you have to do is create a new "manifest example file" in the 'build/manifests' folder. It's important to name this in the following format: `manifest.<browser_name>.json`. This way, the script will automatically detect the file and no coding will be required.

The file is a standard json file, structured the way the browser requires the manifest to be structured. However, instead of values simply add variable names, encased in curly brackets. Then, make sure the supplied variable name is present in the information.json file located in the same folder.

## Example
I want to implement the firefox manifest. 
First, I'll create the `manifest.firefox.json` file. 

Next, I'll see what firefox wants included in the file.
The first thing will be the manifest version.
Usually you'd write: `"manifest_version": 3`.
However, all those variables we want to be updated automatically based on what we put into the information.json file. So instead, we look in the information.json file to see if the value we need is supplied there. And indeed it is, conveniently named "manifest_version". Now, we go back to the manifest.firefox.json file and write `"manifest_version": {manifest_version}`. It's important to enclose the variable in curly brackets. The variable name also has to perfectly match the one in the information.json file.

If you want quotes around the value in the generated file, put those quotes around the entire value name, including the curly brackets. For example, the app name is a string in the generated file. To make sure that generates correctly, we write `"name": "{app_name}"` in the manifest.firefox.json file.

Lastly, if you need a value that isn't yet in the information.json file, simply add it! Just make sure to use the same variable names in both files. 
