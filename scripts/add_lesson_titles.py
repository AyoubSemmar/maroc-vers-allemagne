"""Insert new lesson titles into messages/{locale}.json under learnGerman.data.lessons.
Preserves existing formatting by doing a textual insert before the closing brace
of the lessons object."""
import re
import sys

TITLES = {
    'ar': {
        'a1-13': 'الأفعال الناقصة — Modalverben',
        'a1-14': 'حالة المفعول به — Akkusativ',
        'a1-15': 'صيغة الأمر — Imperativ',
        'a1-16': 'جمع الأسماء — Plural der Nomen',
        'a2-13': 'تصريف الصفة (الأساسيات) — Adjektivdeklination',
        'a2-14': 'الأفعال الناقصة في الماضي — Modalverben Perfekt',
        'a2-15': 'الصيغة المهذّبة — Konjunktiv II für Höflichkeit',
        'a2-16': 'الظروف الضميرية — Pronominaladverbien',
        'b1-13': 'زمن المستقبل — Futur I + Futur II',
        'b1-14': 'الأفعال مع حروف الجر — Verben mit Präpositionen',
        'b2-13': 'الكلام غير المباشر الرسمي — Konjunktiv I',
        'b2-14': 'حروف الإضافة المُلوِّنة — Modalpartikeln',
        'b2-15': 'تكوين الكلمات — Wortbildung',
        'b2-16': 'الجمل الشرطية — Konditionalsätze',
        'b2-17': 'الروابط المتقدمة — Konnektoren erweitert',
        'c1-13': 'حروف الإضافة المتقدّمة — Modalpartikeln (C1)',
        'c1-14': 'الأسلوب الفعلي مقابل الأسلوب الإسمي — Verbalstil vs Nominalstil',
        'c1-15': 'علامات الترقيم — Kommasetzung',
        'c1-16': 'الجمل المركّبة المعقّدة — Hypotaxe vs Parataxe',
    },
    'fr': {
        'a1-13': 'Les verbes de modalité — Modalverben',
        'a1-14': "L'accusatif — Akkusativ",
        'a1-15': "L'impératif — Imperativ",
        'a1-16': 'Le pluriel des noms — Plural der Nomen',
        'a2-13': "La déclinaison de l'adjectif — Adjektivdeklination",
        'a2-14': 'Les verbes de modalité au passé — Modalverben Perfekt',
        'a2-15': 'La forme polie — Konjunktiv II für Höflichkeit',
        'a2-16': 'Les adverbes pronominaux — Pronominaladverbien',
        'b1-13': 'Le futur — Futur I + Futur II',
        'b1-14': 'Verbes avec préposition — Verben mit Präpositionen',
        'b2-13': 'Discours indirect formel — Konjunktiv I',
        'b2-14': 'Les particules modales — Modalpartikeln',
        'b2-15': 'La formation des mots — Wortbildung',
        'b2-16': 'Les phrases conditionnelles — Konditionalsätze',
        'b2-17': 'Connecteurs avancés — Konnektoren erweitert',
        'c1-13': 'Particules modales avancées — Modalpartikeln (C1)',
        'c1-14': 'Style verbal vs nominal — Verbalstil vs Nominalstil',
        'c1-15': 'Ponctuation — Kommasetzung',
        'c1-16': 'Phrases complexes — Hypotaxe vs Parataxe',
    },
    'en': {
        'a1-13': 'Modal verbs — Modalverben',
        'a1-14': 'The accusative case — Akkusativ',
        'a1-15': 'The imperative — Imperativ',
        'a1-16': 'Plurals of nouns — Plural der Nomen',
        'a2-13': 'Adjective declension — Adjektivdeklination',
        'a2-14': 'Modal verbs in the past — Modalverben Perfekt',
        'a2-15': 'The polite form — Konjunktiv II für Höflichkeit',
        'a2-16': 'Pronominal adverbs — Pronominaladverbien',
        'b1-13': 'The future — Futur I + Futur II',
        'b1-14': 'Verbs with prepositions — Verben mit Präpositionen',
        'b2-13': 'Formal reported speech — Konjunktiv I',
        'b2-14': 'Modal particles — Modalpartikeln',
        'b2-15': 'Word formation — Wortbildung',
        'b2-16': 'Conditional sentences — Konditionalsätze',
        'b2-17': 'Advanced connectors — Konnektoren erweitert',
        'c1-13': 'Advanced modal particles — Modalpartikeln (C1)',
        'c1-14': 'Verbal vs nominal style — Verbalstil vs Nominalstil',
        'c1-15': 'Punctuation — Kommasetzung',
        'c1-16': 'Complex sentences — Hypotaxe vs Parataxe',
    },
    'de': {
        'a1-13': 'Modalverben',
        'a1-14': 'Akkusativ',
        'a1-15': 'Imperativ',
        'a1-16': 'Plural der Nomen',
        'a2-13': 'Adjektivdeklination',
        'a2-14': 'Modalverben Perfekt',
        'a2-15': 'Konjunktiv II für Höflichkeit',
        'a2-16': 'Pronominaladverbien',
        'b1-13': 'Futur I + Futur II',
        'b1-14': 'Verben mit Präpositionen',
        'b2-13': 'Konjunktiv I — formale indirekte Rede',
        'b2-14': 'Modalpartikeln',
        'b2-15': 'Wortbildung',
        'b2-16': 'Konditionalsätze',
        'b2-17': 'Konnektoren erweitert',
        'c1-13': 'Modalpartikeln (C1)',
        'c1-14': 'Verbalstil vs Nominalstil',
        'c1-15': 'Kommasetzung',
        'c1-16': 'Hypotaxe vs Parataxe',
    },
}

LESSON_ORDER = ['a1-13','a1-14','a1-15','a1-16','a2-13','a2-14','a2-15','a2-16','b1-13','b1-14','b2-13','b2-14','b2-15','b2-16','b2-17','c1-13','c1-14','c1-15','c1-16']

def update(locale):
    path = f'messages/{locale}.json'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    titles = TITLES[locale]
    # Match the line `"c1-12": "..."` (the last existing lesson key) followed by `\n      }`
    m = re.search(r'("c1-12"\s*:\s*"[^"]*")(\s*\n\s*\})', content)
    if not m:
        raise RuntimeError(f"Could not locate c1-12 closing in {path}")
    last_line = m.group(1)
    closing = m.group(2)
    new_lines = [last_line + ',']
    for i, lid in enumerate(LESSON_ORDER):
        title = titles[lid].replace('\\','\\\\').replace('"','\\"')
        suffix = ',' if i < len(LESSON_ORDER) - 1 else ''
        new_lines.append(f'        "{lid}": "{title}"{suffix}')
    replacement = '\n'.join(new_lines) + closing
    new_content = content[:m.start()] + replacement + content[m.end():]
    # Validate JSON
    import json
    json.loads(new_content)
    with open(path, 'w', encoding='utf-8', newline='\n') as f:
        f.write(new_content)
    print(f"Updated {path}")

if __name__ == '__main__':
    for loc in ['ar','fr','en','de']:
        update(loc)
