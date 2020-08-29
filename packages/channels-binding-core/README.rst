Channels Binding API
--------------------

Channels Binding exposes an JSON API streaming system over `channels <https://github.com/django/channels>`_,
It's designed to work as a full featured RestAPI via websocket, http, or both protocols combined.
in very few code lines, with a very simple and verboseless exchange structure, 
where each django Models would be easily binded and come with native basics operations like 'retrieve', 'search', 'update', 'create', 'delete' and subscription.
We could made the comparaison with django restframework with the REST system.
It also provides react packages with ready-to-use pre configured tools and components to make easy Applications UIs.

Channels-binding is a compilation of somes packages :

- https://pypi.org/project/channels-binding/ for python/django
- https://www.npmjs.com/package/@channels-binding/core for node/react
- https://www.npmjs.com/package/@channels-binding/mui for material-ui integration

Summary
-------

- `Demo (soon)`
- `Capabilities <#capabilities>`__
- `Exchanges Structure Overviews <#exchanges-structure-overviews>`__
- `Gettings Started <#getting-started>`__
- `Custom Events Binding <#custom-events-binding>`__

Capabilities
------------
- Support of 'retrieve', 'form', 'search', 'list''update', 'create', 'save', 'delete', 'subscribe' events
- Support of django signals to refresh any connected instance with React tools
- Support of native django Queryset into React (Material-UI Tables available)
- Support of native django Form into React (Material-UI Fields available)
- Support of Hashed events for targeted subscribers (example: 2 lists on the same stream/event/model but with different filtering)
- Auto channels subscribing groups of interest 'retrieve', 'list', 'delete'
- Custom bindings events through decorators
- Compatible with Django restframework serializers (soon ready)
- Both Async or Sync Consumers (not yet)
- Both HTTP Rest or WS API  (not yet)

Exchanges Structure Overviews
-----------------------------

.. code:: javascript

    SELF SEND => {
        event: "auth.User.search",
        data: {
            page: 2
        }
    }
    SELF RECEIVE => {
        event: "auth.User.search",
        data: { 
            page: 2,
            limit: 25,
            count: 102,
            rows: [{                
                id: 5763,
                username: "Admin",
                email: "admin@admin.com"
            }, ... ]
        }
    }

    SELF SEND => {
        event: "auth.User.retrieve",
        data: { 
            id: 5763 
        }
    }
    SELF RECEIVE => {
        event: "auth.User.retrieve",
        data: { 
            id: 5763,
            username: "Admin",
            email: "admin@admin.com",
            ...andMoreDetails
        }
    }

    SELF SEND => {
        event: "auth.User.update",
        data: { 
            id: 5763,
            username: "Changed Username"
        }
    }
    SELF RECEIVE => {
        event: "auth.User.update",
        data: { 
            success: true
        }
    }
    GROUP RECEIVE => {
        event: "auth.User.retrieve",
        data: { 
            id: 5763,
            username: "Changed Username",
            email: "admin@admin.com",
            ...andMoreDetails
        }
    }

Getting Started
---------------

-  Assume that you have already django>=1.8 and channels>=2.0.0 installed

-  Add ``channels-binding`` to requirements.txt

.. code:: bash

  pip install channels-binding

-  Add ``channels_binding`` to ``INSTALLED_APPS``

.. code:: python


    INSTALLED_APPS = (
        'channels',
        'channels_binding',
    )

-  Configure some optionnals ``SETTINGS``

.. code:: python

    CHANNEL_LAYERS = {
        'default': {
            # ...someChannelsConfig
        },
    }
    CHANNELS_BINDING = {
        "AUTHENTIFICATION_CLASSES": (
            'authentification.AuthenticationStrategyClass', 
        ),
        "DEFAULT_PAGE_SIZE": 25,
        "ANONYMOUS_CONNECTION_ALLOWED": False, # Reject connection of non connected users
    }

-  Add a new AsyncConsumer in your asgi application routing (Read the channels docs)

.. code:: python

    # asgi.py

    from django.urls import path
    from channels.sessions import SessionMiddlewareStack
    from channels.routing import ProtocolTypeRouter, URLRouter
    from channels_binding.consumers import AsyncConsumer

    application = ProtocolTypeRouter({
        'websocket': SessionMiddlewareStack(
            URLRouter([
                path('', AsyncConsumer, name="root"),
            ])
        )
    })

-  Add bindinds inside an app or root bindigns folder

.. code:: python

    # apps/your_app/bindings.py

    from channels_binding.consumers import AsyncBinding
    from .models import YourModel

    '''
        All bindings in apps/*/bindings.py or app/bindings/*.py are auto discovered, like models.py
    '''
    class YourModelBinding(AsyncBinding):

        model = YourModel
        # stream = by default '{app_name.model_name}' if model is set
        # permission_class = by default None (may change in future)
        # serializer_class = by default None (soon compatible with restframwork serializer)
        # queryset = by default YourModel.objects.all()
        # page_size = by default 25 rows for the 'search' and 'list' events
        # post_save_retrieve = by default True, if is True, an instance post_save send the 'retrieve' event to all the stream subscribers


-  Let's start to communicate with a simple retrieve action on a frontal javascript thirdparty

.. code:: javascript

    // Soon React example...

.. code:: javascript

    var ws = new WebSocket("ws://" + window.location.host + "/")
    ws.onmessage = function(e){
        console.log(e.data)
        /*
           Receive: 
           {  
                event: "your_app.YourModel.retrieve",
                data: { 
                    id: 5763,
                    ...someData
                }
           }     
        */
    }
    ws.send(JSON.stringify({
        event: "your_app.YourModel.retrieve",
        data: { 
            id: 5763 
        }
    }))

React front integration
-----------------------

-  Assume that you have already react installed

-  npm install @channels-binding/core

-  For an integration with material-ui

-  npm install @channels-binding/mui

Custom Events Binding
----------------------

-  Add a full custom binding with 

.. code:: python

    # apps/your_app/bindings.py

    from channels_binding.consumers import AsyncBinding, bind
    
    class YourCustomBinding(AsyncBinding):

        stream = 'custom_stream'

        @bind('custom_event')
        async def handle_custom_event(self, data):

            sender = data['sender']

            # Direct reflect the reponse to the current socket pipe
            await self.reflect('custom_event', {
                'msg': f'This a reflected response for {sender}'
            })

            # Send an event to this stream subscribers
            await self.dispatch('custom_group_event', {
                'msg': f'This a dispatched response to the custom_stream subscriber from {sender}'
            })

            # Send an event to this stream subscribers
            await self.broadcast('custom_all_event', {
                'msg': f'This a dispatched response to the all layers from {sender}'
            })

-  Let's try this on a frontal javascript thirdparty

.. code:: javascript

    var ws = new WebSocket("ws://" + window.location.host + "/")
    ws.onmessage = function(e){
        console.log(e.data)
        /*
           Receive (reflected): 
           {  
                event: "custom_stream.custom_event",
                data: { 
                    msg: 'This a reflected response for me!!!'
                }
           }   
           Receive (from group to all "custom_stream" subscribers): 
           {  
                event: "custom_stream.custom_group_event",
                data: { 
                    msg: 'This a dispatched response to the custom_stream subscriber from me!!!'
                }
           }    
           Receive (broadcasted to all): 
           {  
                event: "custom_stream.custom_all_event",
                data: { 
                    msg: 'This a dispatched response to the all layers from me!!!'
                }
           }      
        */
    }
    ws.send(JSON.stringify({
        event: "custom_stream.custom_event",
        data: { 
            sender: 'me!!!' 
        }
    }))