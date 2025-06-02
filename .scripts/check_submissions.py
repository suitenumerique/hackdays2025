import os
import sys
import re
from slugify import slugify
from create_teams import parse_teams

SUBMISSIONS_DIR = "submissions"
TEMPLATE_DIR = ".scripts/templates"


def extract_heading_structure(file_path, team_data=None):
    """Extract the structure of headings (e.g., #, ##, ###) from a Markdown file, replacing {{name}} with team data if needed."""
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")

    headings = []
    with open(file_path, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            match = re.match(r'(#+)\s', line)
            if match:
                heading_text = line
                if team_data:
                    # Replace each {{key}} in the heading with the corresponding value from team_data
                    for key, value in team_data.items():
                        heading_text = heading_text.replace(f"{{{{{key}}}}}", value)
                headings.append((len(match.group(1)), heading_text))
    return headings


def check_headings():
    """Check that each team's submission.md has the same heading structure as the template."""
    errors = []

    try:
        teams = parse_teams()
    except ValueError as e:
        errors.append(str(e))
        print("\nFound issues:", e)
        sys.exit(1)

    # Loop through the teams and check their submissions
    for team in teams:
        team_slug = slugify(team["name"])  # Assuming you're using slugs for team names
        team_path = os.path.join(SUBMISSIONS_DIR, team_slug)

        if not os.path.isdir(team_path):
            errors.append(f"Unexpected file in submissions directory: {team_slug}")
            continue

        submission_path = os.path.join(team_path, "submission_instructions.md")
        template_path = os.path.join(TEMPLATE_DIR, "submission_instructions.md")

        if not os.path.exists(submission_path):
            errors.append(f"Missing submission.md for {team_slug}")
            continue

        try:
            # Pass the whole team data to the extract_heading_structure function
            template_headings = extract_heading_structure(template_path, team_data=team)
            submission_headings = extract_heading_structure(submission_path)
        except FileNotFoundError as e:
            errors.append(str(e))
            continue

        if template_headings != submission_headings:
            errors.append(
                f"Heading structure mismatch in {submission_path}:\n"
                f" - Expected: {template_headings}\n"
                f" - Found:    {submission_headings}"
            )

    if errors:
        print("\nFound issues:")
        for error in errors:
            print(f"- {error}")
        sys.exit(1)
    else:
        print("All submission heading structures and folder structures are correct!")


if __name__ == "__main__":
    check_headings()
