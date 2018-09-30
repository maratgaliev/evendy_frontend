import Vue from 'vue'
import moment from 'moment'
import $ from 'jquery'
require('../../static/js/bootstrap-datetimepicker.min')
Vue.component('date-picker', {
  template: '\
    <input class="form-control datetimepicker"\
          ref="input"\
          name="dp"\
          v-validate="\'required|date_format:DD/MM/YYYY HH:mm\'"\
          v-bind:value="dateModel"\
          autocomplete="off"\
          data-date-format="DD/MM/YYYY HH:mm"\
          placeholder="DD/MM/YYYY HH:mm"\
          type="text" v-once />\
  ',
  props: {
    value: {
      type: String,
      default: moment().format('DD/MM/YYYY HH:mm')
    },
    dateModel: {
      type: String
    }
  },
  watch: {
    value (newValue) {
      this.dp && this.dp.date(newValue || null)
    }
  },
  mounted: function () {
    let self = this
    this.$nextTick(function () {
      $(this.$el).datetimepicker({
        locale: 'ru',
        format: 'DD/MM/YYYY HH:mm',
        widgetPositioning: {
          horizontal: 'right'
        },
        icons: {
          time: 'fa fa-clock-o',
          date: 'fa fa-calendar',
          up: 'fa fa-chevron-up',
          down: 'fa fa-chevron-down',
          previous: 'fa fa-chevron-left',
          next: 'fa fa-chevron-right',
          today: 'fa fa-screenshot',
          clear: 'fa fa-trash',
          close: 'fa fa-remove'
        },
        debug: false
      }).on('dp.change', function (event) {
        let formattedDate = event.date ? event.date.format('DD/MM/YYYY HH:mm') : null
        self.$emit('input', formattedDate)
      })
    })
  }
})
