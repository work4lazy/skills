import json
import os

MARKETPLACE = ".claude-plugin/marketplace.json"
PERSONAL_DIR = "skills/personal"
PERSONAL_PLUGIN = "work4lazy/skills"


def load_json(path):
    with open(path) as f:
        return json.load(f)


def save_json(path, data):
    with open(path, "w") as f:
        json.dump(data, f, indent=2)
        f.write("\n")


def scan_personal_skills():
    result = []
    if not os.path.isdir(PERSONAL_DIR):
        return result
    for entry in sorted(os.listdir(PERSONAL_DIR)):
        skill_dir = os.path.join(PERSONAL_DIR, entry)
        if os.path.isdir(skill_dir) and os.path.isfile(
            os.path.join(skill_dir, "SKILL.md")
        ):
            result.append(f"./{PERSONAL_DIR}/{entry}")
    return result


def update_marketplace(skills):
    marketplace = load_json(MARKETPLACE)
    for plugin in marketplace["plugins"]:
        if plugin["name"] == PERSONAL_PLUGIN:
            plugin["skills"] = skills
            break
    save_json(MARKETPLACE, marketplace)


def main():
    skills = scan_personal_skills()
    update_marketplace(skills)
    print(f"Updated marketplace.json personal group with {len(skills)} skills")


if __name__ == "__main__":
    main()
