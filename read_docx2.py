import sys, os, struct, zipfile, xml.etree.ElementTree as ET

docx_path = r"C:\Users\Anthony\Desktop\第六周课后练习.docx"

# Try as ZIP (real .docx)
try:
    with zipfile.ZipFile(docx_path, "r") as z:
        with z.open("word/document.xml") as f:
            tree = ET.parse(f)
            root = tree.getroot()
    ns = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
    paras = []
    for p in root.iter(f"{{{ns}}}p"):
        t = "".join(t.text or "" for t in p.iter(f"{{{ns}}}t")).strip()
        if t:
            paras.append(t)
    print("=== DOCX FORMAT ===")
    for i, p in enumerate(paras):
        print(f"[P{i}] {p}")
    sys.exit(0)
except Exception as e:
    print(f"Not a docx zip: {e}")

# Try as OLE2 (.doc)
try:
    import olefile
    with olefile.OleFileIO(docx_path) as ole:
        streams = [s for s in ole.listdir() if 'WordDocument' in str(s)]
        print("OLE streams:", ole.listdir())
        
        # Try to extract text from WordDocument stream
        wd_stream = ole.openstream('WordDocument').read()
        print(f"WordDocument size: {len(wd_stream)} bytes")
        
        # Look for UTF-16LE text
        text_parts = []
        i = 0
        while i < len(wd_stream) - 1:
            ch = struct.unpack_from('<H', wd_stream, i)[0]
            if ch == 0x0D:  # paragraph mark
                text_parts.append('\n')
                i += 2
            elif 0x20 <= ch <= 0xFFFD:
                text_parts.append(chr(ch))
                i += 2
            else:
                i += 2
        full_text = ''.join(text_parts)
        lines = [l.strip() for l in full_text.split('\n') if l.strip()]
        print("\n=== DOC (.doc) FORMAT ===")
        for i, line in enumerate(lines):
            print(f"[L{i}] {line}")
except ImportError:
    print("olefile not installed, trying without it")
    # Try raw binary scan for UTF-16LE
    with open(docx_path, 'rb') as f:
        data = f.read()
    
    if data[:8] == bytes.fromhex('D0CF11E0A1B11AE1'):
        print("OLE2 format detected but olefile not available")
        # Try to find text table stream
        # Look for UTF-16LE strings
        results = []
        i = 0
        while i < len(data) - 3:
            ch = struct.unpack_from('<H', data, i)[0]
            if 0x4E00 <= ch <= 0x9FFF or 0x3000 <= ch <= 0x303F or ch == 0x0A or ch == 0x0D:
                # Potential Chinese text
                start = i
                chars = []
                while i < len(data) - 1:
                    c = struct.unpack_from('<H', data, i)[0]
                    if 0x4E00 <= c <= 0x9FFF or 0x3000 <= c <= 0x303F or 0x0020 <= c <= 0x007E:
                        chars.append(chr(c))
                        i += 2
                    else:
                        break
                if len(chars) > 5:
                    results.append(''.join(chars))
                i = start + 2
            else:
                i += 2
        print(f"Found {len(results)} text segments")
        for r in results[:50]:
            print(r)
    else:
        print("Unknown format, header:", data[:8].hex())
except Exception as e:
    print(f"OLE2 read failed: {e}")
    import traceback
    traceback.print_exc()
