import json
import zipfile, shutil
import os
import re

def generate_manifest(browser_name, information_json):
    """Generate a manifest.json based on the manifest examples and put it in a zip with the src folder"""

    template_file = open("./manifests/manifest.{}.json".format(browser_name), "r")
    template_data = template_file.read()
    template_file.close()
    
    # Replace template data with information data
    for jsonKey in information_json:
        template_data = template_data.replace("{" + jsonKey + "}", str(information_json[jsonKey]).replace("'", "\""))
    
    app_name = information_json["app_name"].title().replace(" ", "_")
    version = information_json["app_version"]
    filename = f"{app_name}_v{version}_{browser_name.title()}"
    output_dir = "./output/{}/".format(browser_name)
    temp_dir = output_dir + "temp_src/"
    output_file_path = output_dir + filename 
    
    # Make output folder
    os.makedirs(output_dir, exist_ok=True)

    # Make a new temp copy of the src folder and remove the manifest
    shutil.copytree("../src", temp_dir)
    os.remove(temp_dir + "manifest.json")

    # Create archive
    shutil.make_archive(output_file_path, "zip", temp_dir)

    # Remove temp folder
    shutil.rmtree(temp_dir)

    # Add generated manifest and save zip
    output_zip = zipfile.ZipFile(output_file_path + ".zip", "a")
    output_zip.writestr("manifest.json", template_data)
    output_zip.close()


def generate_manifests(information_json):
    """This function checks inside the manifests folder for valid manifest example files(manifest.<browser>.json) and generates zip files for that"""

    potential_files = os.listdir("./manifests")
    for potential_file in potential_files:
        if not potential_file.startswith("manifest.") or not potential_file.endswith(".json"):
            continue # File is not a valid manifest example
        browser = re.findall("manifest.([a-z]+).json+", potential_file)[0]
        generate_manifest(browser, information_json)


def main():
    # Load the metadata
    information_file = open("./manifests/information.json", "r")
    information_json_string = information_file.read()
    information_file.close()

    # Generate manifests
    information_json = json.loads(information_json_string)
    generate_manifests(information_json)

if __name__ == "__main__":
    main()