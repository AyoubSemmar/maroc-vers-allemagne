"""Insert a lesson overlay before the closing of the 'lessons' object, preserving existing formatting."""
import json
import re
import sys

def add_lesson(file_path, lesson_id, lesson_json_path, indent=4):
    with open(lesson_json_path, 'r', encoding='utf-8') as f:
        lesson_data = json.load(f)
    # Validate JSON of target file
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    json.loads(content)
    # Find the closing of the "lessons" object: the line `  },` before `"title":`
    # Pattern: last `}` followed by newline, indent2, `},` then `"title":`
    m = re.search(r'(\n    \}\n  \},\n  "title":)', content)
    if not m:
        raise RuntimeError("Could not find lessons-closing pattern in " + file_path)
    insert_pos = m.start()  # right before `\n    }\n  },`
    # We're at the `}` that closes the LAST lesson. Change it to `},` and append our new lesson.
    # Actually m.group(1) starts with newline + 4-space indent + `}` (closing last lesson) + newline + 2-space indent + `},`
    # We want to change `\n    }\n  },` to `\n    },\n    "<id>": { ... }\n  },`
    new_lesson_text = json.dumps(lesson_data, ensure_ascii=False, indent=2)
    # Reindent the new lesson text by 4 spaces (since it sits inside lessons object at indent 4)
    new_lesson_lines = new_lesson_text.split('\n')
    indented = ['    ' + l if l else l for l in new_lesson_lines]
    new_lesson_block = '\n'.join(indented)
    replacement = '\n    },\n    "' + lesson_id + '": ' + new_lesson_block.lstrip() + '\n  },\n  "title":'
    new_content = content[:insert_pos] + replacement + content[m.end():]
    # Validate
    json.loads(new_content)
    with open(file_path, 'w', encoding='utf-8', newline='\n') as f:
        f.write(new_content)
    print(f"Added {lesson_id} to {file_path}")

if __name__ == '__main__':
    file_path = sys.argv[1]
    lesson_id = sys.argv[2]
    lesson_json_path = sys.argv[3]
    add_lesson(file_path, lesson_id, lesson_json_path)
