import json
from sockjs.tornado import SockJSConnection
from random import choice
import redis
import sockjs.tornado
import tornado.httpserver
import tornado.web
import tornado.websocket
import tornado.ioloop
import tornado.gen
import uuid

import redis
import tornadoredis
import tornadoredis.pubsub
 
"""
class SockJSDefaultHandler(SockJSConnection):
    def on_message(self, data):
        # Trying to parse response
        data = json.loads(data)
        if data["name"] is not None:
            fct = getattr(self, "on_" + data["name"])
            fct(data["data"])
        else:
            print("SockJSDefaultHandler error: data.name was null")
 
    def publish(self, name, data, userList):
        # Publish data to all room users
        self.broadcast(userList, {
            "name": name,
            "data": json.dumps(data)
        })
"""

redis_client = redis.Redis()
subscriber = tornadoredis.pubsub.SockJSSubscriber(tornadoredis.Client())

class SendMessageHandler(tornado.web.RequestHandler):

    def _send_message(self, channel, msg_type, msg, user=None):
        msg = {'type': msg_type,
               'msg': msg,
               'user': user}
        msg = json.dumps(msg)
        redis_client.publish(channel, msg)

    def post(self):
        message = self.get_argument('message')
        from_user = self.get_argument('from_user')
        to_user = self.get_argument('to_user')
        if to_user:
            self._send_message('private.{}'.format(to_user),
                               'pvt', message, from_user)
            self._send_message('private.{}'.format(from_user),
                               'tvp', message, to_user)
        else:
            self._send_message('broadcast_channel', 'msg', message, from_user)
        self.set_header('Content-Type', 'text/plain')
        self.write('sent: %s' % (message,))


class MessageHandler(sockjs.tornado.SockJSConnection):
    """
    SockJS connection handler.
    Note that there are no "on message" handlers - SockJSSubscriber class
    calls SockJSConnection.broadcast method to transfer messages
    to subscribed clients.
    """
    def _enter_leave_notification(self, msg_type):
        broadcasters = list(subscriber.subscribers['broadcast_channel'].keys())
        message = json.dumps({'type': msg_type,
                              'user': self.user_id,
                              'msg': '',
                              'user_list': [{'id': b.user_id,
                                             'name': b.user_name}
                                            for b in broadcasters]})
        if broadcasters:
            broadcasters[0].broadcast(broadcasters, message)

    def _send_message(self, msg_type, msg, user=None):
        if not user:
            user = self.user_id
        self.send(json.dumps({'type': msg_type,
                              'msg': msg,
                              'user': user}))

    def on_open(self, request):
        # Generate a user ID and name to demonstrate 'private' channels
        self.user_id = str(uuid.uuid4())[:5]
        self.user_name = (
            choice(['John', 'Will', 'Bill', 'Ron', 'Sam', 'Pete']) +
            ' ' +
            choice(['Smith', 'Doe', 'Strong', 'Long', 'Tall', 'Small']))
        # Send it to user
        self._send_message('uid', self.user_name, self.user_id)
        # Subscribe to 'broadcast' and 'private' message channels
        subscriber.subscribe(['broadcast_channel',
                              'private.{}'.format(self.user_id)],
                             self)
        # Send the 'user enters the chat' notification
        self._enter_leave_notification('enters')

    def on_close(self):
        subscriber.unsubscribe('private.{}'.format(self.user_id), self)
        subscriber.unsubscribe('broadcast_channel', self)
        # Send the 'user leaves the chat' notification
        self._enter_leave_notification('leaves')

