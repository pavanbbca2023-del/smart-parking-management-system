# Simple Health Check View
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def health_check(request):
    """Simple health check endpoint"""
    return JsonResponse({
        'status': 'OK',
        'message': 'Backend is working',
        'timestamp': timezone.now().isoformat()
    })

@csrf_exempt  
def test_cors(request):
    """Test CORS endpoint"""
    response = JsonResponse({
        'cors': 'working',
        'origin': request.META.get('HTTP_ORIGIN', 'No origin'),
        'method': request.method
    })
    
    # Add CORS headers manually
    response['Access-Control-Allow-Origin'] = '*'
    response['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    response['Access-Control-Allow-Headers'] = 'Content-Type'
    
    return response