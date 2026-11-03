import zlib
import struct
import math

def create_app_icon(size, filename):
    width = size
    height = size
    raw_data = bytearray()

    # Dark rounded background with glowing blue/purple center and white letters
    radius = size * 0.22
    cx, cy = size / 2, size / 2

    for y in range(height):
        raw_data.append(0) # filter byte (None)
        for x in range(width):
            # Distance from center
            dx = (x - cx) / (size / 2)
            dy = (y - cy) / (size / 2)
            dist = math.sqrt(dx*dx + dy*dy)

            # Gradient background from deep blue to sleek black
            r = int(max(0, min(255, 12 + (1.0 - dist) * 20)))
            g = int(max(0, min(255, 20 + (1.0 - dist) * 60)))
            b = int(max(0, min(255, 45 + (1.0 - dist) * 190)))

            # Draw a sleek dumbbell or lightning/FS shape in the center
            nx = (x - cx) / (size * 0.28)
            ny = (y - cy) / (size * 0.28)

            # Draw stylized dumbbell weights: two vertical pills and connecting bar
            is_bar = abs(ny) < 0.12 and abs(nx) < 0.65
            is_left_plate = abs(nx + 0.6) < 0.15 and abs(ny) < 0.55
            is_right_plate = abs(nx - 0.6) < 0.15 and abs(ny) < 0.55
            is_left_inner = abs(nx + 0.38) < 0.1 and abs(ny) < 0.4
            is_right_inner = abs(nx - 0.38) < 0.1 and abs(ny) < 0.4

            if is_bar or is_left_plate or is_right_plate or is_left_inner or is_right_inner:
                r, g, b = 255, 255, 255
            elif dist < 0.7:
                # Add subtle cyan glow around the dumbbell
                r = min(255, r + int((0.7 - dist) * 80))
                g = min(255, g + int((0.7 - dist) * 140))
                b = min(255, b + int((0.7 - dist) * 255))

            raw_data.extend((r, g, b, 255))

    def make_chunk(chunk_type, data):
        return struct.pack(">I", len(data)) + chunk_type + data + struct.pack(">I", zlib.crc32(chunk_type + data) & 0xffffffff)

    png = b"\x89PNG\r\n\x1a\n"
    ihdr_data = struct.pack(">IIBBBBB", width, height, 8, 6, 0, 0, 0)
    png += make_chunk(b"IHDR", ihdr_data)
    idat_data = zlib.compress(bytes(raw_data), 9)
    png += make_chunk(b"IDAT", idat_data)
    png += make_chunk(b"IEND", b"")

    with open(filename, "wb") as f:
        f.write(png)
    print(f"Created {filename} ({size}x{size})")

create_app_icon(192, "public/icon-192.png")
create_app_icon(512, "public/icon-512.png")

