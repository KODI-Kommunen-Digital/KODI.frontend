import React from 'react'
import PropTypes from "prop-types";


const ManageStatus = (props) => {
    const { cityStatusModal,
        setCityStatusModal,
        updateListingsStatus,
        fetchListings,
        t,
        status } = props
    return (
        <>
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex justify-center items-center px-5 md:px-10 lg:px-[5rem] xl:px-[10rem] 2xl:px-[20rem] z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md">
                    <h2 className="text-xl font-bold mb-4">{t("manageStatus")}</h2>

                    {cityStatusModal?.listing?.cityData?.map((city, index) => (
                        <div key={city?.id} className="mb-4">
                            <label className="block font-medium text-gray-700">
                                {city?.name}
                            </label>
                            <select
                                value={city?.listingStatus}
                                onChange={(e) => {
                                    const updatedCityData = cityStatusModal?.listing?.cityData?.map((c) =>
                                        c.id === city.id
                                            ? { ...c, listingStatus: parseInt(e.target.value) }
                                            : c
                                    );
                                    setCityStatusModal((prev) => ({
                                        ...prev,
                                        listing: { ...prev.listing, cityData: updatedCityData },
                                    }));
                                }}
                                className="w-full mt-1 border border-gray-300 rounded px-3 py-2"
                            >
                                {Object.entries(status).map(([id, name]) => (
                                    <option key={id} value={id}>
                                        {t(name.toLowerCase())}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ))}

                    <div className="flex justify-end mt-6 space-x-3">
                        <button
                            onClick={() => setCityStatusModal({ visible: false, listing: null })}
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-100 sm:mt-0 sm:w-auto sm:text-sm"
                        >
                            {t("cancel")}
                        </button>
                        <button
                            onClick={async () => {
                                const payload = {
                                    data: cityStatusModal?.listing?.cityData?.map(city => ({
                                        cityId: city?.id,
                                        statusId: city?.listingStatus,
                                    }))
                                };

                                await updateListingsStatus(cityStatusModal?.listing?.id, payload);
                                fetchListings();
                                setCityStatusModal({ visible: false, listing: null });
                            }}

                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-800 text-base font-medium text-white hover:bg-blue-700 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                            {t("saveChanges")}
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
ManageStatus.propTypes = {
    cityStatusModal: PropTypes.shape({
        visible: PropTypes.bool,
        listing: PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            cityData: PropTypes.arrayOf(
                PropTypes.shape({
                    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
                    name: PropTypes.string,
                    listingStatus: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
                })
            ),
        }),
    }),
    setCityStatusModal: PropTypes.func.isRequired,
    updateListingsStatus: PropTypes.func.isRequired,
    fetchListings: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    status: PropTypes.object.isRequired,
};

export default ManageStatus