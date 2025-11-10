import React from 'react'
import EntitySearch from '@/components/entity-search';
import { useWorkflowsParams } from '../hooks/use-workflows-params';
import { useEntitySearch } from '@/hooks/use-entity-search';

const Search = () => {
    const [params, setParams] = useWorkflowsParams();
    const { searchValue, setSearchValue } = useEntitySearch({ params, setParams });
    return (
        <EntitySearch placeholder="Search workflows" onChange={setSearchValue} value={searchValue} />
    )
}

export default Search