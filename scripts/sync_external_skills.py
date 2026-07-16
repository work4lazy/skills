import json
import subprocess
import shutil
import os
import re

EXTERNAL_CFG = "external-sources.json"
MARKETPLACE = ".claude-plugin/marketplace.json"
SKILLS_DIR = "skills"
RESERVED = {"personal"}


def load_json(path):
    with open(path) as f:
        return json.load(f)


def save_json(path, data):
    with open(path, "w") as f:
        json.dump(data, f, indent=2)
        f.write("\n")


def scan_existing_external():
    existing = set()
    for entry in os.listdir(SKILLS_DIR):
        org_dir = os.path.join(SKILLS_DIR, entry)
        if not os.path.isdir(org_dir) or entry in RESERVED:
            continue
        for skill_dir in os.listdir(org_dir):
            if os.path.isdir(os.path.join(org_dir, skill_dir)):
                existing.add((entry, skill_dir))
    return existing


def delete_orphans(configured):
    orphans = configured["existing"] - configured["expected"]
    for org, skill in orphans:
        path = os.path.join(SKILLS_DIR, org, skill)
        shutil.rmtree(path, ignore_errors=True)
        print(f"Deleted orphan: {org}/{skill}")
    for entry in os.listdir(SKILLS_DIR):
        org_dir = os.path.join(SKILLS_DIR, entry)
        if not os.path.isdir(org_dir) or entry in RESERVED:
            continue
        if not os.listdir(org_dir):
            shutil.rmtree(org_dir, ignore_errors=True)
            print(f"Deleted empty org dir: {entry}")


def update_marketplace(config):
    marketplace = load_json(MARKETPLACE)
    for source in config["sources"]:
        repo = source["repo"]
        org = repo.split("/")[0]
        skills = source["skills"]
        paths = sorted(f"./{SKILLS_DIR}/{org}/{s}" for s in skills)
        for plugin in marketplace["plugins"]:
            if plugin["name"] == repo:
                plugin["skills"] = paths
                break
        else:
            marketplace["plugins"].append(
                {"name": repo, "source": "./", "skills": paths}
            )
    save_json(MARKETPLACE, marketplace)
    print("Updated marketplace.json external groups")


def sync():
    config = load_json(EXTERNAL_CFG)

    configured_set = set()
    for source in config["sources"]:
        org = source["repo"].split("/")[0]
        for skill in source["skills"]:
            configured_set.add((org, skill))

    existing_set = scan_existing_external()

    orphans = existing_set - configured_set
    for org, skill in orphans:
        path = os.path.join(SKILLS_DIR, org, skill)
        shutil.rmtree(path, ignore_errors=True)
        print(f"Deleted orphan: {org}/{skill}")

    for entry in os.listdir(SKILLS_DIR):
        org_dir = os.path.join(SKILLS_DIR, entry)
        if not os.path.isdir(org_dir) or entry in RESERVED:
            continue
        if not os.listdir(org_dir):
            shutil.rmtree(org_dir, ignore_errors=True)
            print(f"Deleted empty org dir: {entry}")

    for source in config["sources"]:
        repo = source["repo"]
        org = repo.split("/")[0]
        skills = source["skills"]
        clone_dir = f"/tmp/source-{repo.replace('/', '-')}"
        subprocess.run(
            [
                "git",
                "clone",
                "--depth",
                "1",
                f"https://github.com/{repo}.git",
                clone_dir,
            ],
            check=True,
            capture_output=True,
        )
        for skill in skills:
            src = os.path.join(clone_dir, "skills", skill)
            dst = os.path.join(SKILLS_DIR, org, skill)
            shutil.rmtree(dst, ignore_errors=True)
            shutil.copytree(src, dst)
            print(f"Synced {repo}/{skill}")

    update_marketplace(config)


if __name__ == "__main__":
    sync()
