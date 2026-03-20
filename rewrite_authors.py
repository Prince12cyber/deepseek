x#!/usr/bin/env python3
import subprocess
import re
import sys

def rewrite_authors():
    # Export the git repository
    print("Exporting git repository...")
    export = subprocess.run(['git', 'fast-export', '--all'], capture_output=True, text=True)
    
    if export.returncode != 0:
        print(f"Error exporting: {export.stderr}")
        return False
    
    content = export.stdout
    
    # Replace all author and committer names and emails
    # Pattern: "author <email>" or "committer <email>"
    # We want to change both to Prince12cyber <pk7716327@gmail.com>
    
    # Replace author lines
    content = re.sub(r'author [^<]+ <[^>]+>', 'author Prince12cyber <pk7716327@gmail.com>', content)
    
    # Replace committer lines  
    content = re.sub(r'committer [^<]+ <[^>]+>', 'committer Prince12cyber <pk7716327@gmail.com>', content)
    
    print("Importing rewritten repository...")
    # Import the rewritten history
    import_proc = subprocess.run(['git', 'fast-import'], input=content, capture_output=True, text=True)
    
    if import_proc.returncode != 0:
        print(f"Error importing: {import_proc.stderr}")
        return False
    
    print("Successfully rewrote git history!")
    print(import_proc.stdout)
    return True

if __name__ == '__main__':
    rewrite_authors()