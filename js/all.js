Vue.component('card-update', {
  template: '#cardUpdate',
  props: ['carddata'],
  computed: {
    cardColor: function () {                
      var color = '';
      var statusfor = this.carddata.Status;
      if (statusfor == '普通') {
        color = "status-aqi2";
      } else if (statusfor == '對敏感族群不健康') {
        color = "status-aqi3"
      } else if (statusfor == '對所有族群不健康') {
        color = "status-aqi4"
      } else if (statusfor == '非常不健康') {
        color = "status-aqi5"
      } else if (statusfor == '危害') {
        color = "status-aqi6"
      } else if (statusfor == '良好') {
        color = "status-aqi7"
      }             
      return color;
    }
  },
  methods: {
    addFavorite: function () {
      this.$emit('add', this.carddata);
    }
  },
});
var app = new Vue({
  el: '#app',
  data: {
    data: [],
    location: [],
    stared: JSON.parse(localStorage.getItem('key')) || [],
    filter: 'all',
  },
  // 請在此撰寫 JavaScript
  created: function () {
    this.getData()
  },
  methods: {
    getData() {
      const vm = this;
      const api = 'http://opendata2.epa.gov.tw/AQI.json';

      // 使用 jQuery ajax
      $.get(api).then(function (response) {
        vm.data = response;
        var newData = [];
        for (let i = 0; i < vm.data.length; i++) {
          newData.push(vm.data[i].County);
        }
        vm.location = [...(new Set(newData))];
      });
    },
    addFavorite(item){
      var vm = this ;
      if(vm.stared.indexOf(item.SiteName) == -1) {
        vm.stared.push(item.SiteName);
      }
      localStorage.setItem("key" , JSON.stringify(vm.stared));
    },
    removeFavorite(e){
      var vm = this ;
      this.stared.splice(vm.stared.indexOf(e.SiteName),1)
      localStorage.setItem("key" , JSON.stringify(vm.stared));
    }
  },
  computed: {
    filterData: function () {
      var vm = this;
      if (vm.filter == 'all') {
        return vm.data.filter(item => {
          return vm.stared.indexOf(item.SiteName) === -1;
        })
      }
      else {
        return vm.data.filter(item => {
          return item.County === vm.filter && vm.stared.indexOf(item.SiteName) === -1;
        })
      }
    },
    filterFavorite: function(){
      var vm = this ;
      return this.data.filter(item=> {
        return vm.stared.indexOf(item.SiteName) > -1;
      })
    }
  }

});
