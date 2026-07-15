import json
import subprocess
import shutil
import os

with open("external-sources.json") as f:
    config = json.load(f)

for source in config["sources"]:
    repo = source["repo"]
    skills = source["skills"]
    clone_dir = f"/tmp/source-{repo.replace('/', '-')}"
    subprocess.run(
        ["git", "clone", "--depth", "1", f"https://github.com/{repo}.git", clone_dir],
        check=True,
        capture_output=True,
    )
    for skill in skills:
        src = os.path.join(clone_dir, "skills", skill)
        dst = os.path.join("skills", "external", skill)
        shutil.rmtree(dst, ignore_errors=True)
        shutil.copytree(src, dst)
        print(f"Synced {repo}/{skill}")
