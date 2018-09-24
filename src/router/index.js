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
import Stats from '@/components/Stats'
import User from '@/components/User'
import Ratings from '@/components/Ratings'

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
      path: '/users/:user',
      name: 'User',
      props: true,
      component: User
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
      path: '/stats',
      name: 'Stats',
      component: Stats
    },
    {
      path: '/contacts',
      name: 'Contacts',
      component: Contacts
    },
    {
      path: '/users',
      name: 'Ratings',
      component: Ratings
    }
  ]
})
