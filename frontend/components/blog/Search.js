import Head from "next/head"
import Link from "next/link"
import { useState } from "react"
import { listSearch } from "../../actions/blog"


const Search = ({ childern }) => {

    const [values, setValues] = useState({
        search: undefined,
        results: [],
        searched: false,
        message: ''
    })

    const { search, searched, results, message } = values

    const searchSubmit = async (e) => {
        e.preventDefault()

        try {
            let data = await listSearch({ search })

            if (data) {
                setValues({ ...values, results: data, searched: true, message: `${data.length} blogs found` })
            }

        } catch (error) {
            console.log(error)
        }
    }

    const handleChange = e => {
        // console.log(e.target.value)
        setValues({ ...values, search: e.target.value, searched: false, results: [] })
    }

    const searchedBlog = (results = []) => {
        return (
            <div className="jumbotron bg-white">
                {message && <p className="pt-4 font-italic text-muted">{message}</p>}

                {results.map((blog, i) => {
                    return (
                        <div key={i}>
                            <Link href={`/blogs/${blog.slug}`} className="text-primary" style={{ textDecoration: 'none' }}>
                                {blog.title}
                            </Link>
                        </div>
                    )
                })}
            </div>
        )
    }

    const searchForm = () => {
        return (

            <form onSubmit={searchSubmit}>
                <div className="row pt-3">
                    <div className="col-md-8">
                        <input type="search" className="form-control" placeholder="Search Blogs" onChange={handleChange} />
                    </div>

                    <div className="col-md-4">
                        <button className="btn btn-block btn-outline-primary" type="submit">
                            Search
                        </button>
                    </div>
                </div>

            </form>
        )
    }


    return (
        <>
            <div className="container-fluid">
                <div className="pt-3">
                    {searchForm()}
                </div>

            </div>

            <div className="container-fluid pt-5" style={{height:'100px'}}>
                {searched && <div style={{ marginTop: '-60px' }}>{searchedBlog(results)}</div>}
            </div>

        </>
    )

}

export default Search