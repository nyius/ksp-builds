import React from 'react';
import KspImage from '../../assets/kspImage.jpg';
import { GoArrowUp, GoArrowDown } from 'react-icons/go';

function BuildCard() {
	return (
		<div class="card card-compact w-96 bg-base-400 shadow-xl cursor-pointer hover:bg-base-200 hover:skew-y-1 transition-all">
			<figure>
				<img src={KspImage} alt="Shoes" />
			</figure>
			<div class="card-body">
				<h2 class="card-title text-white">Epic Build!</h2>
				<p className="truncate">
					If a dog chews shoes whose shoes does he choose? qwheiuqwe qlwieuqhblwie hqlwuiheqiuwhuqiw iuqhw iuqhw iuhq wiuhqwiueh iuqhiuhqiu hquwehqu ihuqiheiuqwh iuqwhuiqhwuqhweu qhwue hqwiuehq iuhqiuwheqiuwheuiqwh uwh uqhweikqhweiuqwheqh
					uqhwueqhw qiwehqiwe
				</p>
				{/* <div class="card-actions justify-end">
					<button class="btn btn-primary">Buy Now</button>
				</div> */}
				<div className="votes flex flex-row">
					<div className="text-2xl cursor-pointer">
						<GoArrowUp />
					</div>
					<div className="text-2xl cursor-pointer">
						<GoArrowDown />
					</div>
				</div>
			</div>
		</div>
	);
}

export default BuildCard;
