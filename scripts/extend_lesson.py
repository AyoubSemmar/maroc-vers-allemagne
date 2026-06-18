"""Extend an existing lesson overlay by appending vocabulary items and exercise questions.
Loads the existing lesson JSON for {locale}, appends the supplied items, writes back via replace_lesson logic.
"""
import json, sys, os
sys.path.insert(0, os.path.dirname(__file__))
from replace_lesson import replace_lesson

def extend(file_path, lesson_id, additions_path, out_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    lesson = data['lessons'][lesson_id]
    with open(additions_path, 'r', encoding='utf-8') as f:
        additions = json.load(f)
    if 'vocabulary' in additions:
        lesson['vocabulary'].extend(additions['vocabulary'])
    if 'exercise' in additions and 'questions' in additions['exercise']:
        lesson['exercise']['questions'].extend(additions['exercise']['questions'])
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(lesson, f, ensure_ascii=False, indent=2)
    print(f"Extended {lesson_id} -> {out_path}")

if __name__ == '__main__':
    extend(sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4])
