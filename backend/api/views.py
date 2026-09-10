from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.conf import settings
from django.utils import timezone


@api_view(['GET'])
def api_status(request):
    """
    Health check and initial architecture endpoint.
    Confirms DRF configuration, CORS setup, and active database backend.
    """
    db_engine = settings.DATABASES['default']['ENGINE'].split('.')[-1]
    db_name = settings.DATABASES['default']['NAME']

    return Response({
        'status': 'online',
        'project': 'Farm Management System (FMS)',
        'version': '1.0.0 (Phase 1 Foundation)',
        'team': {
            'team_leader': 'Sonali Bhauso Vidure',
            'team_member': 'Shraddha Suresh Gurav'
        },
        'database': {
            'engine': db_engine,
            'configured_for_mysql': settings.USE_MYSQL,
        },
        'server_time': timezone.now().isoformat(),
        'message': 'FMS Backend API is operational and ready for Phase 2 (Authentication).'
    })
