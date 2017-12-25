import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Register from '@/components/Register'
import Events from '@/components/Events'
import Event from '@/components/Event'
import EventNew from '@/components/EventNew'
import Logout from '@/components/Logout'
import News from '@/components/News'
import Contacts from '@/components/Contacts'
import EventEdit from '@/components/EventEdit'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Events',
      component: Events
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/logout',
      name: 'Logout',
      component: Logout
    },
    {
      path: '/editor',
      name: 'EventNew',
      component: EventNew
    },
    {
      path: '/events/:event',
      name: 'Event',
      props: true,
      component: Event
    },
    {
      path: '/event/:event/edit',
      name: 'EventEdit',
      props: true,
      component: EventEdit
    },
    {
      path: '/news',
      name: 'News',
      component: News
    },
    {
      path: '/contacts',
      name: 'Contacts',
      component: Contacts
    }
  ]
})
