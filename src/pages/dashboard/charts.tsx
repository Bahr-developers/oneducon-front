import { ChartBarInteractive } from '@/components/charts/bar-charts';
import { ChartPieLabelList } from '@/components/charts/pie-charts';
import { ChartTooltipIndicatorLine } from '@/components/charts/tool-tips';

const ChartsMain = () => {
    return (
        <div className='w-full mt-4'>
            <div className="w-full flex justify-between items-center gap-4 my-2">
                <div className="w-[50%]">
                    <ChartTooltipIndicatorLine />
                </div>
                <div className="w-[50%]">
                    <ChartPieLabelList />
                </div>
            </div>
            <ChartBarInteractive />
        </div>
    );
};

export default ChartsMain;