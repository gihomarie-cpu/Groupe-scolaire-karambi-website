"""Extract plain text (paragraphs + tables) from .docx files."""
import sys
import zipfile
import xml.etree.ElementTree as ET

NS = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"


def para_text(p):
    parts = []
    for node in p.iter():
        if node.tag == NS + "t":
            parts.append(node.text or "")
        elif node.tag == NS + "tab":
            parts.append("\t")
        elif node.tag in (NS + "br", NS + "cr"):
            parts.append("\n")
    return "".join(parts)


def extract(path):
    with zipfile.ZipFile(path) as z:
        xml = z.read("word/document.xml")
    root = ET.fromstring(xml)
    body = root.find(NS + "body")
    lines = []
    for child in body:
        if child.tag == NS + "p":
            lines.append(para_text(child))
        elif child.tag == NS + "tbl":
            for row in child.findall(NS + "tr"):
                cells = []
                for tc in row.findall(NS + "tc"):
                    cell_text = " ".join(
                        para_text(p) for p in tc.findall(NS + "p")
                    )
                    cells.append(cell_text.strip())
                lines.append(" | ".join(cells))
            lines.append("")
    return "\n".join(lines)


for path in sys.argv[1:]:
    out = path + ".txt"
    text = extract(path)
    with open(out, "w", encoding="utf-8") as f:
        f.write(text)
    print(f"{path} -> {out} ({len(text)} chars)")