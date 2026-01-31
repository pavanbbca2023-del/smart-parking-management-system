import json

input_file = "data_dump.json"
output_file = "data_dump_clean.json"

try:
    # Try reading as UTF-16 (default PowerShell output usually)
    with open(input_file, 'r', encoding='utf-16') as f:
        data = json.load(f)
except UnicodeError:
    try:
        # Fallback to UTF-8
        with open(input_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error reading file: {e}")
        exit(1)

# Write as clean UTF-8
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=4)

print(f"Created {output_file}")
