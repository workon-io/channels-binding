import os
import sys
import re
import subprocess


if __name__ == "__main__":

    try:
        revision = sys.argv[1]
    except BaseException:
        revision = 'revision'

    version_py = os.path.join(os.path.dirname(__file__), 'channels_binding/__init__.py')
    content = open(version_py, 'r').read()
    matches = re.search(r'__version__ = "([\d\.]+)"', content)
    version = matches.group(1)
    print('Current version: {}'.format(version))

    has_changes = 'la copie de travail est propre' not in str(subprocess.check_output(["git", "status"]).rstrip())
    if has_changes:

        major, medium, minor = version.split(".")

        if revision == 'minor':
            minor = int(minor) + 1

        elif revision == 'medium':
            medium = int(medium) + 1
            minor = 0

        elif revision == 'major':
            major = int(major) + 1
            medium = 0
            minor = 0

        else:
            minor = int(minor) + 1

        new_version = "{}.{}.{}".format(major, medium, minor)
        print('New version: {}'.format(new_version))

        comment = input('Comment: ')
        comment = comment.strip()
        if not comment:
            comment = 'autotagging'
        comment = comment.replace('"', '\\"')

        content = content.replace(matches.group(0), '__version__ = "{}"'.format(new_version))
        open(version_py, 'w').write(content)

        print(subprocess.check_output(["git", "add", "."]))
        print(subprocess.check_output(["git", "commit", "-am", '"%s"' % comment]))
        print(subprocess.check_output(["git", "tag", "-a", new_version, '-m', '"%s"' % comment]))

    else:
        print('No changes')
