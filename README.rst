Channels Bindins API
------------

Channels Binding exposes an JSON API streaming system across Websocket or HTTP Rest in very few code lines, with a very simple and verboseless exchange structure.

- `Gettings Started <#getting-started>`__

Capabilities
------------
- `Both Async or Sync Consumers <#getting-started>`__
- Both HTTP Rest or WS API
- Full support of 'retrieve', 'search', 'list', 'update', 'create', 'save', 'delete', 'subscribe' events
- Support of Hashed events for targeted subscribing
- Auto channels subscribing groups of interest 'retrieve', 'list', 'delete'
- Compatible with Django restframework serializers
- Easy ways to add custom bindings events throught decorators

Exchanges Structure
------------

.. code:: javascript

    SEND => {
        event: "auth.User.search",
        data: {
            page: 2
        }
    }
    RECEIVE => {
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

    SEND => {
        event: "auth.User.retrieve",
        data: { 
            id: 5763 
        }
    }
    RECEIVE => {
        event: "auth.User.retrieve",
        data: { 
            id: 5763,
            username: "Admin",
            email: "admin@admin.com",
            ...andMoreDetails
        }
    }

    SEND => {
        event: "auth.User.save",
        data: { 
            id: 5763,
            username: "Changed Username"
        }
    }
    RECEIVE => {
        event: "auth.User.save",
        data: { 
            success: true
        }
    }
    RECEIVE => {
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
            ...some channels config
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

    from .models import MyModel

    class Binding(AsyncBinding):

        model = MyModel


-  Let's start to communicate with Javascript simple websocket

.. code:: javascript

    var ws = new WebSocket("ws://" + window.location.host + "/")
    ws.onmessage = function(e){
        console.log(e.data)
        /*
           Receive: 
           {  
                event: "your_app.MyModel.retrieve",
                data: { 
                    id: 5763,
                    ...someData
                }
           }     
        */
    }
    ws.send(JSON.stringify({
        event: "your_app.MyModel.retrieve",
        data: { 
            id: 5763 
        }
    }))
