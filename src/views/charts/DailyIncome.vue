<script>
  import { Line, mixins } from 'vue-chartjs'
  const { reactiveProp } = mixins
  /* const options = {
    maintainAspectRatio: false,
    legend: {
      display: false
    },
    scales: {
      xAxes: [{
        gridLines: {
          color: 'black'
        }
      }],
      yAxes: [{
        gridLines: {
          color: 'black'
        }
      }]
    },
    elements: {
      line: {
        borderWidth: 5
      },
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4
      }
    }
  } */

  export default Line.extend({
    // mixins to actually craete a prop names chartData
    mixins: [reactiveProp],
    props: ['options'],
    mounted () {
      this.renderChart(this.chartData, this.options)
    }
  })
</script>
