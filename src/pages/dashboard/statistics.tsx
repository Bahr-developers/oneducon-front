import { storeUtils } from "@/utils/store";
import { useQuery } from "@tanstack/react-query";

const Statistics = () => {
    const { data } = useQuery({
        queryKey: ['storeStats'],
        queryFn: storeUtils.getStats
    })

    const statsList = [
        {
            title: 'Jami tan narx',
            value: (data?.totalCostPrices._sum.cost_price as number) / Number(localStorage.getItem('usd_rate')) ,
            currency: '$'
        },
        {
            title: 'Jami sotuv narx',
            value: data?.totalSalePrices._sum.sale_price || 0,
            currency: 'UZS'
        },
        {
            title: 'Kassadagi pul',
            value: data?.totalPayments || 0,
            currency: 'UZS'
        }
    ];

    // function decimalToNumber(decimal: { s: number, e: number, d: number[] }): number {
    //     const digits = decimal.d.join('');
    //     const exponent = decimal.e;
    //     const sign = decimal.s;

    //     return sign * Number(digits) * Math.pow(10, exponent - digits.length);
    // }


    // const somToDollar = (price: number) => {
    //     const dollarKurs = Number(localStorage.getItem('usd_rate')) || 12000
    //     return price / dollarKurs
    // }
    return (
        <div className='flex justify-between items-center w-full gap-4 mt-2'>
            <div className='flex justify-between items-center w-full gap-4 mt-2'>
                {statsList.map((el, index) => (
                    <div className="w-full border p-4 rounded-xl" key={index}>
                        <h4>{el.title}</h4>
                        <div className="flex items-center gap-x-2 text-3xl font-medium mt-3">
                            {el.value.toLocaleString()}
                            <p className='text-2xl'>{el.currency}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Statistics;