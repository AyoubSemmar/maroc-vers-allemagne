"""Replace an existing lesson overlay in a translations JSON file, preserving formatting."""
import json, re, sys

def replace_lesson(file_path, lesson_id, lesson_json_path):
    with open(lesson_json_path, 'r', encoding='utf-8') as f:
        lesson_data = json.load(f)
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    # Validate
    json.loads(content)
    # Find lesson entry: from "lid": { ... } until matching close brace
    # Use a regex to find the lesson key, then count braces
    key_pat = '"' + re.escape(lesson_id) + '":'
    m = re.search(key_pat, content)
    if not m:
        raise RuntimeError(f"{lesson_id} not found in {file_path}")
    start = m.start()
    # Find the opening { after the colon
    brace_open = content.find('{', m.end())
    # Walk braces to find matching close
    depth = 0
    i = brace_open
    while i < len(content):
        c = content[i]
        if c == '"':
            # skip string
            j = i + 1
            while j < len(content):
                if content[j] == '\\':
                    j += 2
                    continue
                if content[j] == '"':
                    break
                j += 1
            i = j + 1
            continue
        if c == '{':
            depth += 1
        elif c == '}':
            depth -= 1
            if depth == 0:
                end = i + 1
                break
        i += 1
    else:
        raise RuntimeError("Could not find closing brace")
    # Detect indentation: the lesson is at indent 4 inside lessons object
    # Get text from "<lid>":  forward
    new_lesson_text = json.dumps(lesson_data, ensure_ascii=False, indent=2)
    new_lesson_lines = new_lesson_text.split('\n')
    indented = ['    ' + l if l else l for l in new_lesson_lines]
    new_lesson_block = '\n'.join(indented).lstrip()
    replacement = '"' + lesson_id + '": ' + new_lesson_block
    new_content = content[:start] + replacement + content[end:]
    json.loads(new_content)
    with open(file_path, 'w', encoding='utf-8', newline='\n') as f:
        f.write(new_content)
    print(f"Replaced {lesson_id} in {file_path}")

if __name__ == '__main__':
    replace_lesson(sys.argv[1], sys.argv[2], sys.argv[3])
