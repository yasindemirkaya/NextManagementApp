import { capitalizeFirstLetter } from "@/helpers/capitalizeFirstLetter";
import { useRouter } from "next/router";

const UserDetailPage = () => {
    const router = useRouter();
    const { userId } = router.query;

    // Formatter fonksiyonu
    const queryFormatter = (userId) => {
        if (userId) {
            // userId örneği: "kevin-owens-41642312-bc53-45ee-ad38-8e45930da129"
            const parts = userId.split('-');

            const name = parts[0];
            const surname = parts[1];
            const id = parts.slice(2).join('-');
            const test = ""

            return { name, surname, id };
        }
        return {};
    };

    const userData = queryFormatter(userId);


    return (
        <>
            {capitalizeFirstLetter(userData.name)} {capitalizeFirstLetter(userData.surname)} User Detail Page
        </>
    );
};

export default UserDetailPage;
