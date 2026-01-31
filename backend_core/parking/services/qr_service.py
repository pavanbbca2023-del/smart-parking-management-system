"""
QR SERVICE - SIMPLE VERSION
============================
Generate and validate QR codes
Easy to understand - every step commented!
"""

import uuid


# ========== FUNCTION 1: GENERATE QR CODE ==========

def generate_qr():
    """
    Generate a unique QR code for parking session
    
    Format: "QR-" + 12 hexadecimal characters
    
    Examples:
    - "QR-a1b2c3d4e5f6"
    - "QR-f6e5d4c3b2a1"
    
    Returns:
        QR code string (example: "QR-a1b2c3d4e5f6")
    """
    
    # STEP 1: Generate unique ID using UUID
    unique_id = uuid.uuid4()
    
    # STEP 2: Convert to string and remove dashes
    unique_string = str(unique_id).replace('-', '')
    
    # STEP 3: Take first 12 characters
    qr_short = unique_string[:12]
    
    # STEP 4: Format as QR-XXXXXX
    qr_code = f"QR-{qr_short}"
    
    # STEP 5: Return the QR code
    return qr_code


# ========== FUNCTION 2: VALIDATE QR CODE ==========

def validate_qr_code(qr_code):
    """
    Validate QR code format
    
    Rules:
    - Must start with "QR-"
    - Must have 12 characters after "QR-"
    - Characters must be hexadecimal (0-9, a-f)
    - Total length = 15 characters
    
    Examples:
    - Valid: "QR-a1b2c3d4e5f6"
    - Invalid: "QR-abc" (too short)
    - Invalid: "INVALID-a1b2c3d4e5" (wrong prefix)
    
    Arguments:
        qr_code: QR code string to validate
    
    Returns:
        True if valid, False if invalid
    """
    
    # STEP 1: Check if QR code is empty
    if not qr_code:
        return False
    
    # STEP 2: Check if it starts with "QR-"
    if not qr_code.startswith("QR-"):
        return False
    
    # STEP 3: Check total length (QR- = 3 chars + 12 hex chars = 15)
    if len(qr_code) != 15:
        return False
    
    # STEP 4: Get the part after "QR-"
    qr_part = qr_code[3:]
    
    # STEP 5: Check if it's hexadecimal (0-9, a-f, A-F)
    try:
        # Try to convert hex string to integer
        int(qr_part, 16)
        # If successful, it's valid hexadecimal
        return True
    except ValueError:
        # Not valid hexadecimal
        return False


# ========== FUNCTION 3: DECODE QR CODE ==========

def decode_qr_code(qr_code):
    """
    Decode a QR code (extract information)
    
    Our simple QR codes are just unique identifiers.
    This function validates and returns QR code info.
    
    Arguments:
        qr_code: QR code string
    
    Returns:
        Dictionary with QR code information
        None if QR code is invalid
    """
    
    # STEP 1: Validate the QR code first
    if not validate_qr_code(qr_code):
        return None
    
    # STEP 2: Return QR code information
    qr_info = {
        'qr_code': qr_code,
        'is_valid': True,
        'format': 'Simple UUID-based'
    }
    
    # STEP 3: Return information
    return qr_info


# ========== QR SERVICE CLASS ==========

class QRService:
    """
    QR Service class for compatibility with management commands
    """
    
    @staticmethod
    def generate_qr():
        """Generate QR code"""
        return generate_qr()
    
    @staticmethod
    def validate_qr_code(qr_code):
        """Validate QR code"""
        return validate_qr_code(qr_code)
    
    @staticmethod
    def decode_qr_code(qr_code):
        """Decode QR code"""
        return decode_qr_code(qr_code)
