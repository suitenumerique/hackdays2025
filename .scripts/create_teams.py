import os
import re
import sys
import markdown
from bs4 import BeautifulSoup
from slugify import slugify
import shutil

TEAMS_FILE = "teams.md"
SUBMISSIONS_DIR = "submissions"
TEMPLATE_DIR = ".scripts/templates"

def parse_teams():
    """Parse the teams and extract team name, lead, members, and idea."""
    with open(TEAMS_FILE, encoding="utf-8") as f:
        markdown_text = f.read()

    html = markdown.markdown(markdown_text)
    soup = BeautifulSoup(html, 'html.parser')

    # Validate heading structure
    headings = soup.find_all(re.compile(r'^h[1-6]$'))

    if not headings:
        raise ValueError("No headings found in the file.")

    if headings[0].name != 'h1':
        raise ValueError("The first heading must be an h1.")

    for heading in headings[1:]:
        if heading.name != 'h2':
            raise ValueError(
                f"Invalid heading '{heading.name}' found. "
                "Only an initial h1 and h2 headings are allowed."
            )

    teams = []
    current_team = None

    for element in soup.find_all(['h2', 'ul', 'p']):
        if element.name == 'h2':  # Team name header
            if current_team:  # Save the previous team if it exists
                teams.append(current_team)

            # Start a new team
            current_team = {
                "name": element.get_text().strip(),
                "lead": None,
                "members": [],
                "idea": None
            }
        elif element.name == 'ul' and current_team:
            for li in element.find_all('li'):
                text = li.get_text().strip()
                if ":" in text:
                    key, value = text.split(":", 1)
                    key = key.strip().lower()
                    value = value.strip()
                    if key in {"lead", "members", "idea"}:
                        current_team[key] = value

    # Add the last team if one exists
    if current_team:
        teams.append(current_team)

    # Validate required information
    for team in teams:
        if not team['name']:
            raise ValueError(f"Team name is missing for a team.")
        if not team['lead']:
            raise ValueError(f"Team lead is missing for team '{team['name']}'.")
        if not team['members']:
            raise ValueError(f"Members are missing for team '{team['name']}'.")
        if not team['idea']:
            raise ValueError(f"Idea is missing for team '{team['name']}'.")

    return teams

def check_unique_slugs(teams):
    """Check that all team slugs are unique."""
    slugs = {}
    for team in teams:
        slug = slugify(team["name"])
        if slug in slugs:
            raise ValueError(
                f"Duplicate slug detected:\n"
                f" - '{team['name']}' and '{slugs[slug]}' both generate slug '{slug}'.\n"
                f"Please rename one of the teams."
            )
        slugs[slug] = team["name"]

def copy_templates(team_path, team):
    """Copy the content of the templates directory to the team folder, replacing placeholders."""
    for root, dirs, files in os.walk(TEMPLATE_DIR):
        target_dir = os.path.join(team_path, os.path.relpath(root, TEMPLATE_DIR))
        os.makedirs(target_dir, exist_ok=True)
        
        for file in files:
            source_file = os.path.join(root, file)
            target_file = os.path.join(target_dir, file)
            shutil.copy(source_file, target_file)
            print(f"Copied {source_file} to {target_file}")

            # Replace placeholders in the copied file
            replace_placeholders(target_file, team)

def replace_placeholders(file_path, team):
    """Replace placeholders like {{key}} with team values dynamically."""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    for key, value in team.items():
        placeholder = f'{{{{{key}}}}}'  # builds {{name}}, {{idea}}, etc.
        if isinstance(value, list):
            value = ', '.join(value)  # join lists like members into a string
        content = content.replace(placeholder, str(value))

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

def create_team_structure(teams):
    """Create folders for each team and copy the template content."""
    for team in teams:
        slug = slugify(team["name"])
        team_path = os.path.join(SUBMISSIONS_DIR, slug)
        os.makedirs(team_path, exist_ok=True)
        print(f"Created: {team_path}")
        
        # Copy the templates into each team's folder with replacements
        copy_templates(team_path, team)

def main(dry_run=False):
    teams = parse_teams()

    if not teams:
        print("No teams found.")
        return

    check_unique_slugs(teams)

    if dry_run:
        print("Dry run: checking extracted team information...")
        for idx, team in enumerate(teams, start=1):
            print(f"\nTeam {idx}:")
            print(f"  Name: {team['name']}")
            print(f"  Lead: {team['lead']}")
            print(f"  Members: {team['members']}")
            print(f"  Idea: {team['idea']}")
        print("\nDry run completed!")
    else:
        print("Creating folder structure and copying templates...")
        create_team_structure(teams)
        print("Done!")

if __name__ == "__main__":
    dry_run = "--dry-run" in sys.argv
    main(dry_run=dry_run)
