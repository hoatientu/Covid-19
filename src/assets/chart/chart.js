import { Bar } from 'vue-chartjs'

export default {
    extends: Bar,
    name: "BarChart",
    mounted () {
        this.getData()
    },
    methods: {
        async getData () {
            const res = await axios.get('https://www.trackcorona.live/api/countries')
            this.renderChart({
                labels: res.data.data.map(val => val.location),
                datasets: [
                    {
                        label: 'Confirmed',
                        backgroundColor: '#f87979',
                        data: res.data.data.map(val => val.confirmed)
                    }
                ]
            }, {responsive: true, maintainAspectRatio: false})
        }
    }
}